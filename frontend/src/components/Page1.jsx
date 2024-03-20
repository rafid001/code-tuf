import React, { useState } from "react";
import { Link } from "react-router-dom";

function Page1() {
    const [username, setUsername] = useState("");
    const [language, setLanguage] = useState("C++");
    const [stdin, setStdin] = useState("");
    const [sourceCode, setSourceCode] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageType, setMessageType] = useState("");
    const [messageText, setMessageText] = useState("");

    // Language mapping object
    const languageMapping = {
        "Javascript": 63, // Example language ID for Javascript
        "C++": 54, // Example language ID for C++
        "Python": 71, // Example language ID for Python
        "Java": 62, // Example language ID for Java
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    codeLanguage: languageMapping[language], // Use language mapping
                    stdin,
                    sourceCode,
                }),
            });
            if (response.ok) {
                console.log("Snippet submitted successfully");
                setMessageType("success");
                setMessageText("Snippet submitted successfully");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 3000); 
                setUsername("");
                setLanguage("C++");
                setStdin("");
                setSourceCode("");
            } else {
                console.error("Failed to submit snippet");
                setMessageType("error");
                setMessageText("Failed to submit snippet");
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 5000); 
            }
        } catch (error) {
            console.error("Error submitting snippet:", error);
            setMessageType("error");
            setMessageText("Error submitting snippet");
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        }
    };

    return (
        <div>
            <form className="snippet-form" onSubmit={handleSubmit}>
                <h2>Submit Code Snippet</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text"
                           id="username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="language">Preferred Code Language</label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="Javascript">Javascript</option>
                        <option value="C++">C++</option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="stdin">Standard Input (stdin)</label>
                    <textarea id="stdin"
                              value={stdin}
                              onChange={(e) => setStdin(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="sourceCode">Source Code:</label>
                    <textarea id="sourceCode"
                              value={sourceCode}
                              onChange={(e) => setSourceCode(e.target.value)}
                              required/>
                </div>
                <button type="submit">Submit</button>
            </form>
            <div className="centered">
                <Link to="/page2" className="link-button">View Submitted Entries</Link>
            </div>
            <div>
                {showMessage && (
                    <div className={`message ${messageType}`}>{messageText}</div>
                )}
            </div>
        </div>
    )
}

export default Page1;
