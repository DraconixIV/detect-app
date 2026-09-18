import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { getMyUserCode, getMyDisplayName, normalizeSessionCode } from "../services/sessionService";

/**
 * Hook to manage live GPS presence & real-time alerts for collaborative team sessions
 * Uses high-frequency broadcast for silky smooth GPS cursor streaming + presence roster for join/leave notifications
 */
export default function useTeamPresence(workspace, position, setToast) {
  const [teammates, setTeammates] = useState([]);
  const channelRef = useRef(null);
  const positionRef = useRef(position);
  const knownMembersRef = useRef(new Set());
  const isInitialSyncRef = useRef(true);
  const teammatesMapRef = useRef(new Map());

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Push live position updates via Realtime Broadcast whenever current user coordinates update
  useEffect(() => {
    if (!position || !channelRef.current || workspace?.mode !== "session" || !workspace?.targetCode) return;

    const myCode = normalizeSessionCode(getMyUserCode());
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    channelRef.current.send({
      type: "broadcast",
      event: "gps_update",
      payload: {
        userCode: myCode,
        userName: myName,
        position: position,
        timestamp: Date.now()
      }
    }).catch((err) => {
      console.warn("Realtime broadcast GPS error:", err);
    });
  }, [position, workspace?.mode, workspace?.targetCode]);

  useEffect(() => {
    if (workspace?.mode !== "session" || !workspace?.targetCode) {
      setTeammates([]);
      teammatesMapRef.current.clear();
      knownMembersRef.current.clear();
      isInitialSyncRef.current = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const sessionCode = normalizeSessionCode(workspace.targetCode);
    const myCode = normalizeSessionCode(getMyUserCode());
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    const channelName = `team-session-${sessionCode}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: myCode
        },
        broadcast: {
          self: false
        }
      }
    });

    channelRef.current = channel;
    isInitialSyncRef.current = true;

    // 1. High-frequency GPS position stream via Broadcast
    channel.on("broadcast", { event: "gps_update" }, ({ payload }) => {
      if (!payload || payload.userCode === myCode) return;
      if (!payload.position || !Array.isArray(payload.position)) return;

      const existing = teammatesMapRef.current.get(payload.userCode) || {};
      teammatesMapRef.current.set(payload.userCode, {
        ...existing,
        userCode: payload.userCode,
        userName: payload.userName || existing.userName || `Détecteuriste ${payload.userCode.slice(-4)}`,
        position: payload.position,
        updatedAt: payload.timestamp || Date.now()
      });

      setTeammates(Array.from(teammatesMapRef.current.values()));
    });

    // 2. Teammate join / leave notifications via Presence
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const currentKeys = new Set(Object.keys(state));

      // Handle new joiners
      currentKeys.forEach((key) => {
        if (key === myCode) return;
        if (!knownMembersRef.current.has(key)) {
          knownMembersRef.current.add(key);
          const presences = state[key];
          const latest = presences?.[presences.length - 1];
          const joinerName = latest?.userName || `Détecteuriste ${key.slice(-4)}`;

          if (latest?.position && Array.isArray(latest.position) && !teammatesMapRef.current.has(key)) {
            teammatesMapRef.current.set(key, {
              userCode: key,
              userName: joinerName,
              position: latest.position,
              updatedAt: Date.now()
            });
            setTeammates(Array.from(teammatesMapRef.current.values()));
          }

          // Trigger join popup toast (only for real arrivals after initial room join)
          if (!isInitialSyncRef.current && setToast) {
            setToast({
              message: `👋 ${joinerName} a rejoint la session d'équipe !`,
              type: "success"
            });
          }
        }
      });

      // Handle leavers
      knownMembersRef.current.forEach((key) => {
        if (!currentKeys.has(key)) {
          knownMembersRef.current.delete(key);
          const oldTeammate = teammatesMapRef.current.get(key);
          teammatesMapRef.current.delete(key);
          setTeammates(Array.from(teammatesMapRef.current.values()));

          if (setToast) {
            const leaverName = oldTeammate?.userName || `Détecteuriste ${key.slice(-4)}`;
            setToast({
              message: `🚪 ${leaverName} a quitté la session.`,
              type: "info"
            });
          }
        }
      });

      isInitialSyncRef.current = false;
    });

    // 3. New Find & Delete Find Broadcast listeners
    channel.on("broadcast", { event: "new_team_find" }, ({ payload }) => {
      if (!payload || payload.user_code === myCode) return;
      if (setToast) {
        setToast({
          message: `✨ ${payload.finder_name || "Un coéquipier"} vient de trouver : ${payload.title || payload.category} !`,
          type: "success"
        });
      }
      window.dispatchEvent(new CustomEvent("geoprospect-team-find-added", { detail: payload }));
    });

    channel.on("broadcast", { event: "delete_team_find" }, ({ payload }) => {
      if (!payload || !payload.id) return;
      window.dispatchEvent(new CustomEvent("geoprospect-team-find-deleted", { detail: payload.id }));
    });

    // 4. Periodic GPS heartbeat (every 3 seconds) to ensure fresh position broadcast
    const heartbeatInterval = setInterval(() => {
      if (positionRef.current && channelRef.current) {
        const curMyName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;
        channelRef.current.send({
          type: "broadcast",
          event: "gps_update",
          payload: {
            userCode: myCode,
            userName: curMyName,
            position: positionRef.current,
            timestamp: Date.now()
          }
        }).catch(() => {});
      }
    }, 3000);

    // 5. Subscribe and register presence
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        try {
          await channel.track({
            userCode: myCode,
            userName: myName,
            position: positionRef.current || null,
            joinedAt: Date.now()
          });

          if (positionRef.current) {
            await channel.send({
              type: "broadcast",
              event: "gps_update",
              payload: {
                userCode: myCode,
                userName: myName,
                position: positionRef.current,
                timestamp: Date.now()
              }
            });
          }
        } catch (e) {
          console.warn("Presence registration error:", e);
        }
      }
    });

    return () => {
      clearInterval(heartbeatInterval);
      if (channel) {
        supabase.removeChannel(channel);
      }
      channelRef.current = null;
      teammatesMapRef.current.clear();
      knownMembersRef.current.clear();
      isInitialSyncRef.current = true;
    };
  }, [workspace?.mode, workspace?.targetCode]);

  const broadcastFind = (find) => {
    if (channelRef.current && workspace?.mode === "session" && workspace?.targetCode) {
      const myCode = normalizeSessionCode(getMyUserCode());
      const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;
      channelRef.current.send({
        type: "broadcast",
        event: "new_team_find",
        payload: {
          ...find,
          finder_name: myName,
          user_code: myCode,
          session_code: normalizeSessionCode(workspace.targetCode)
        }
      }).catch((err) => {
        console.warn("Find broadcast error:", err);
      });
    }
  };

  const broadcastDeleteFind = (findId) => {
    if (channelRef.current && workspace?.mode === "session" && workspace?.targetCode) {
      channelRef.current.send({
        type: "broadcast",
        event: "delete_team_find",
        payload: { id: findId }
      }).catch((err) => {
        console.warn("Delete find broadcast error:", err);
      });
    }
  };

  return { teammates, broadcastFind, broadcastDeleteFind };
}
