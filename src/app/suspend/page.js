"use client";

import React, { useEffect, useState } from "react";
import { Ban, Clock, ShieldAlert, Mail } from "lucide-react";

const Page = () => {
    // Replace this with your API/JWT value
    const suspendUntil = "2026-07-25T12:00:00.000Z";

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(suspendUntil).getTime();
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    expired: true,
                });

                clearInterval(interval);
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
                expired: false,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [suspendUntil]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="w-full max-w-xl rounded-3xl border border-red-600/40 bg-card shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-600/10 border-b border-border p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center mx-auto">
                        <Ban className="w-10 h-10 text-red-400 dark:text-red-600" />
                    </div>
                    <h1 className="mt-5 text-4xl font-bold text-foreground">
                        Account Suspended
                    </h1>
                    <p className="mt-3 text-muted">
                        Your account has been temporarily suspended by an administrator.
                    </p>
                </div>
                {/* Body */}
                <div className="p-8">
                    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                        <ShieldAlert className="text-red-400 dark:text-red-600 w-6 h-6" />
                        <div>
                            <p className="text-foreground font-semibold">
                                Access Restricted
                            </p>
                            <p className="text-muted text-sm">
                                You cannot use your account until the suspension period ends.
                            </p>
                        </div>
                    </div>
                    {/* Countdown */}
                    <div className="mt-8">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Clock className="dark:text-red-600 text-red-400" />
                            <h2 className="text-xl font-semibold text-foreground">
                                Suspension Ends In
                            </h2>
                        </div>
                        {timeLeft.expired ? (
                            <div className="text-center">
                                <p className="text-primary text-xl font-bold">
                                    Suspension Expired
                                </p>
                                <p className="text-muted mt-2">
                                    Please refresh the page or log in again.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: "Days", value: timeLeft.days },
                                    { label: "Hours", value: timeLeft.hours },
                                    { label: "Minutes", value: timeLeft.minutes },
                                    { label: "Seconds", value: timeLeft.seconds },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="bg-background border border-border rounded-2xl py-5 text-center"
                                    >
                                        <p className="text-3xl font-bold text-rd-400 dark:text-red-600">
                                            {String(item.value).padStart(2, "0")}
                                        </p>
                                        <p className="text-muted text-sm mt-2">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Contact */}
                    <div className="mt-10 rounded-xl bg-card border border-border p-5">
                        <div className="flex items-center gap-3">
                            <Mail className="text-red-400 dark:text-red-600" />
                            <div>
                                <p className="text-foreground font-medium">
                                    Need Assistance?
                                </p>
                                <p className="text-muted text-sm">
                                    If you believe this suspension was made in error, please
                                    contact the administrator for assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;