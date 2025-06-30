import React from "react"
import randomOTPGenerator from "@/utils/randomOTPGenerator"

interface IEmailVerification {
    name: string
}

export default function EmailVerification({ name }: IEmailVerification) {
    const OTP = randomOTPGenerator();
    return (
        <html>
            <body
                style={{
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                    lineHeight: "1.6",
                }}
            >
                <h2 style={{ color: "#333" }}>Welcome, {name} 👋</h2>
                <p>Your OTP for email confirmation is:</p>
                <p
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#0070f3",
                    }}
                >
                    {OTP}
                </p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                    This OTP is valid for 10 minutes.
                </p>
            </body>
        </html>
    )
}