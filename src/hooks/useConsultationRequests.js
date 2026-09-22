import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import {
  getMyUserCode,
  getMyDisplayName,
  normalizeSessionCode,
  getApprovedConsultationViewers,
  addApprovedConsultationViewer,
  removeApprovedConsultationViewer
} from "../services/sessionService";

/**
 * Hook to manage real-time authorization requests for Read-Only Map Consultation
 * Prevents unauthorized snooping and ensures detectorists retain full control over their spots.
 */
export default function useConsultationRequests(workspace, setWorkspace, setToast) {
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [activeViewers, setActiveViewers] = useState(() => getApprovedConsultationViewers());
  const inboxChannelRef = useRef(null);
  const pendingRequestsRef = useRef(new Map());

  const myCode = normalizeSessionCode(getMyUserCode());

  // Keep inbox channel open at all times to receive live consultation requests
  useEffect(() => {
    if (!myCode) return;

    const channelName = `user-inbox-${myCode}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false }
      }
    });

    inboxChannelRef.current = channel;

    // 1. Incoming consultation request from another user
    channel.on("broadcast", { event: "consult_request" }, ({ payload }) => {
      if (!payload || !payload.requesterCode) return;
      const reqCodeClean = normalizeSessionCode(payload.requesterCode);
      if (reqCodeClean === myCode) return;

      setIncomingRequest({
        requestId: payload.requestId || `req-${Date.now()}`,
        requesterCode: reqCodeClean,
        requesterName: payload.requesterName || `Détecteuriste ${reqCodeClean.slice(-4)}`,
        timestamp: payload.timestamp || Date.now()
      });
    });

    // 2. Incoming response to our outgoing consultation request
    channel.on("broadcast", { event: "consult_response" }, ({ payload }) => {
      if (!payload || !payload.requestId) return;
      const handler = pendingRequestsRef.current.get(payload.requestId);
      if (handler) {
        handler(payload);
        pendingRequestsRef.current.delete(payload.requestId);
      }
    });

    // 3. Incoming revocation of access while in consultation mode
    channel.on("broadcast", { event: "consult_revoked" }, ({ payload }) => {
      if (!payload || !payload.ownerCode) return;
      const ownerClean = normalizeSessionCode(payload.ownerCode);

      if (workspace?.mode === "consultation" && normalizeSessionCode(workspace?.targetCode) === ownerClean) {
        if (setWorkspace) {
          setWorkspace({ mode: "personal", targetCode: null, sessionName: null });
        }
        if (setToast) {
          setToast({
            message: `⚠️ Le propriétaire (${ownerClean}) a interrompu le partage de sa carte.`,
            type: "warning"
          });
        }
      }
    });

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        console.warn(`Inbox channel ${channelName} failed to connect.`);
      }
    });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      inboxChannelRef.current = null;
    };
  }, [myCode, workspace?.mode, workspace?.targetCode]);

  // Host approves an incoming request
  const approveRequest = (req) => {
    if (!req) return;
    const reqCodeClean = normalizeSessionCode(req.requesterCode);
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    // Send positive authorization broadcast directly to the requester's inbox
    const targetChannelName = `user-inbox-${reqCodeClean}`;
    const targetChannel = supabase.channel(targetChannelName);

    targetChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        targetChannel.send({
          type: "broadcast",
          event: "consult_response",
          payload: {
            requestId: req.requestId,
            approverCode: myCode,
            approverName: myName,
            approved: true
          }
        }).catch((err) => console.warn("Approve send error:", err));

        setTimeout(() => {
          supabase.removeChannel(targetChannel);
        }, 1500);
      }
    });

    const updated = addApprovedConsultationViewer(reqCodeClean, req.requesterName);
    setActiveViewers(updated || getApprovedConsultationViewers());
    setIncomingRequest(null);

    if (setToast) {
      setToast({
        message: `👁️ Carte partagée en lecture seule avec ${req.requesterName}.`,
        type: "success"
      });
    }
  };

  // Host rejects an incoming request
  const rejectRequest = (req) => {
    if (!req) return;
    const reqCodeClean = normalizeSessionCode(req.requesterCode);
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    const targetChannelName = `user-inbox-${reqCodeClean}`;
    const targetChannel = supabase.channel(targetChannelName);

    targetChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        targetChannel.send({
          type: "broadcast",
          event: "consult_response",
          payload: {
            requestId: req.requestId,
            approverCode: myCode,
            approverName: myName,
            approved: false,
            reason: "Demande refusée par le propriétaire de la carte."
          }
        }).catch((err) => console.warn("Reject send error:", err));

        setTimeout(() => {
          supabase.removeChannel(targetChannel);
        }, 1500);
      }
    });

    setIncomingRequest(null);

    if (setToast) {
      setToast({
        message: `Demande de consultation refusée.`,
        type: "info"
      });
    }
  };

  // Host revokes access for an active viewer
  const revokeViewerAccess = (viewerCode, viewerName = "") => {
    const cleanViewer = normalizeSessionCode(viewerCode);
    const targetChannelName = `user-inbox-${cleanViewer}`;
    const targetChannel = supabase.channel(targetChannelName);

    targetChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        targetChannel.send({
          type: "broadcast",
          event: "consult_revoked",
          payload: {
            ownerCode: myCode
          }
        }).catch((err) => console.warn("Revoke send error:", err));

        setTimeout(() => {
          supabase.removeChannel(targetChannel);
        }, 1500);
      }
    });

    const updated = removeApprovedConsultationViewer(cleanViewer);
    setActiveViewers(updated || []);

    if (setToast) {
      setToast({
        message: `Accès révoqué pour ${viewerName || cleanViewer}.`,
        type: "info"
      });
    }
  };

  /**
   * Send a consultation request to a target user code and wait for response
   * Returns a Promise resolving to { approved: boolean, reason?: string, approverName?: string }
   */
  const requestMapConsultation = (targetUserCode, timeoutMs = 35000) => {
    return new Promise((resolve) => {
      const cleanTarget = normalizeSessionCode(targetUserCode);
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

      let timeoutTimer = null;

      const responseHandler = (payload) => {
        if (timeoutTimer) clearTimeout(timeoutTimer);
        resolve({
          approved: !!payload.approved,
          reason: payload.reason || (payload.approved ? "" : "Demande refusée par le propriétaire."),
          approverName: payload.approverName || cleanTarget
        });
      };

      pendingRequestsRef.current.set(requestId, responseHandler);

      timeoutTimer = setTimeout(() => {
        pendingRequestsRef.current.delete(requestId);
        resolve({
          approved: false,
          timeout: true,
          reason: "Délai d'attente dépassé. Assurez-vous que votre ami a l'application GeoProspect ouverte sur son téléphone."
        });
      }, timeoutMs);

      // Send request to target user's inbox
      const targetChannelName = `user-inbox-${cleanTarget}`;
      const targetChannel = supabase.channel(targetChannelName);

      targetChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          targetChannel.send({
            type: "broadcast",
            event: "consult_request",
            payload: {
              requestId: requestId,
              requesterCode: myCode,
              requesterName: myName,
              timestamp: Date.now()
            }
          }).catch((err) => {
            console.warn("Failed to send consult_request broadcast:", err);
          });

          setTimeout(() => {
            supabase.removeChannel(targetChannel);
          }, 2000);
        }
      });
    });
  };

  return {
    incomingRequest,
    activeViewers,
    approveRequest,
    rejectRequest,
    revokeViewerAccess,
    requestMapConsultation
  };
}
