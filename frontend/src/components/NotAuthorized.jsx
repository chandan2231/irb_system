export default function NotAuthorized() {
    return (
        <div
            className=""
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
            }}
        >
            <h1
                style={{
                    fontSize: "3rem",
                    margin: "0",
                    padding: "0",
                    color: "#3f51b5"
                }}
            >
                Not Authorized
            </h1>
            <p
                style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    color: "black",
                    margin: "0",
                    padding: "0",
                }}
            >
                You are not authorized to view this page.
            </p>
        </div>
    );
}
