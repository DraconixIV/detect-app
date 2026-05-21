import {
  Polyline,
  Popup
} from "react-leaflet";

export default function TrackHistory({
  savedTracks
}) {
  return (
    <>
      {savedTracks.map(
        (savedTrack, index) => (
          <Polyline
            key={savedTrack.id}
            positions={
              savedTrack.positions
            }
            color={
              index % 2 === 0
                ? "red"
                : "orange"
            }
            weight={4}
          >
            <Popup>
              <div
                style={{
                  minWidth: "200px"
                }}
              >
                <h3>
                  🛰️{" "}
                  {
                    savedTrack.session_name
                  }
                </h3>

                <p>
                  📍 Points GPS :
                  {" "}
                  {
                    savedTrack
                      .positions
                      ?.length
                  }
                </p>

                <p>
                  📅 Créé le :
                  <br />
                  {new Date(
                    savedTrack.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Polyline>
        )
      )}
    </>
  );
}