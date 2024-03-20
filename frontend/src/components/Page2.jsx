import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Page2() {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch("http://localhost:3000/snippets");
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }
            const data = await response.json();
            console.log("Fetched entries:", data); // Log fetched data
            const entriesWithStdout = await Promise.all(data.map(async (entry) => {
                try {
                    const stdoutResponse = await fetch(`http://localhost:3000/stdout/${entry.id}`);
                    if (!stdoutResponse.ok) {
                        throw new Error('Failed to fetch stdout');
                    }
                    const stdoutData = await stdoutResponse.json();
                    return { ...entry, stdout: stdoutData.stdout };
                } catch (error) {
                    console.error("Error fetching stdout:", error);
                    return { ...entry, stdout: "N/A" }; // Placeholder for stdout
                }
            }));
            setEntries(entriesWithStdout);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };
    

    return (
        <div>
            <h2>Submitted Entries</h2>
            <table className="snippet-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Code Language</th>
                        <th>Standard Input (stdin)</th>
                        <th>Source Code (First 100 Characters)</th>
                        <th>Standard Output (stdout)</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.username}</td>
                            <td>{entry.code_language}</td>
                            <td>{entry.stdin}</td>
                            <td>{entry.truncated_code}</td>
                            <td>{entry.stdout}</td>
                            <td>{entry.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/" className="link-button">Back to Page 1</Link>
        </div>
    );
}

export default Page2;
