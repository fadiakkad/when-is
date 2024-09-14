import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import SocialMedia from "./SocialMedia";
const CountdownTimer = ({ targetDate, CountDown, EventName,shareUrl }) => {
    const [timeLeft, setTimeLeft] = useState({});

    // Function to calculate time left
    const calculateTimeLeft = (targetDate) => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                totalDays: Math.floor(difference / (1000 * 60 * 60 * 24)),
                totalHours: Math.floor(difference / (1000 * 60 * 60)),
                months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)), // Months
                days: Math.floor((difference / (1000 * 60 * 60 * 24)) % 30), // Days within month
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),    // Hours
                minutes: Math.floor((difference / 1000 / 60) % 60),         // Minutes
                seconds: Math.floor((difference / 1000) % 60),              // Seconds
            };
        }

        return timeLeft;
    };

    // Update the time left every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div
            style={{
                textAlign: "center",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "20px",
                border: "1px solid #1e81b0",
            }}
        >
            <h2 className="text-white" style={{ backgroundColor: "#1e81b0", height: "50px" }}>
                {CountDown}
            </h2>
            <p>CountDown</p>

            <div style={{ display: "table", width: "100%", fontWeight: "bold" }}>
                <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", fontSize: "50px", textAlign: "center" }}>
                        {timeLeft.months}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "50px", textAlign: "center" }}>
                        {timeLeft.days}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "50px", textAlign: "center" }}>
                        {timeLeft.hours}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "50px", textAlign: "center" }}>
                        {timeLeft.minutes}
                    </div>
                    <div style={{ display: "table-cell", fontSize: "50px", textAlign: "center" }}>
                        {timeLeft.seconds}
                    </div>
                </div>
                <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", fontSize: "20px", textAlign: "center" }}>
                        أشهر
                    </div>
                    <div style={{ display: "table-cell", fontSize: "20px", textAlign: "center" }}>
                        أيام
                    </div>
                    <div style={{ display: "table-cell", fontSize: "20px", textAlign: "center" }}>
                        ساعات
                    </div>
                    <div style={{ display: "table-cell", fontSize: "20px", textAlign: "center" }}>
                        دقائق
                    </div>
                    <div style={{ display: "table-cell", fontSize: "20px", textAlign: "center" }}>
                        ثواني
                    </div>
                </div>
            </div>
            <hr />
            <Table striped bordered hover responsive>

                <tbody>
                    <tr>
                        <td>{`باقي على ${EventName} بالأشهر:`}</td>
                        <td>{Math.floor(timeLeft.months)} أشهر</td>
                    </tr>
                    <tr>
                        <td>{`باقي على ${EventName} بالأيام:`}</td>
                        <td>{Math.floor(timeLeft.totalDays)} أيام</td>
                    </tr>
                    <tr>
                        <td>{`باقي على ${EventName} بالساعات:`}</td>
                        <td>{Math.floor(timeLeft.totalHours)} ساعات</td>
                    </tr>
                </tbody>
            </Table>
            <hr/>
            <SocialMedia shareUrl={shareUrl} />
        </div>
    );
};

export default CountdownTimer;
