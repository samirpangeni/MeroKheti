"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldAlert, HelpCircle } from "lucide-react";
import axios from "axios";

export default function SuspendPage() {
    const [timeLeft, setTimeLeft] = useState("");
    const [expired, setExpired] = useState(false);
    const [user, setUser] = useState("")
    
    useEffect(() => {
        const suspend = async () => {
            const res = await axios.get("/api/user");
            const userData = res.data.user
            setUser(userData)  
        }
        suspend();
    }, [])

const suspendedUntil = user.suspendedUntil;
    useEffect(() => {
        const updateCountdown = () => {
            const end = new Date(suspendedUntil).getTime();
            const now = Date.now();

            const difference = end - now;

            if (difference <= 0) {
                setExpired(true);
                setTimeLeft("");
                return;
            }

            const days = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );

            const hours = Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            );

            const minutes = Math.floor(
                (difference / (1000 * 60)) % 60
            );

            const seconds = Math.floor(
                (difference / 1000) % 60
            );

            setTimeLeft(
                `${days}d ${hours}h ${minutes}m ${seconds}s`
            );
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [suspendedUntil]);
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            <div className="w-full max-w-2xl">

                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
                    <div className="border-b border-border px-6 py-8 text-center sm:px-10">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
                            <ShieldAlert
                                size={32}
                                className="text-red-600 dark:text-red-400"/>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Account Suspended
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-muted">
                            Your account has been temporarily suspended by an
                            administrator.
                        </p>
                    </div>

                    
                    <div className="space-y-5 px-6 py-8 sm:px-10">
                        {/* Access Restricted */}
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
                            <div className="flex gap-4">
                                <ShieldAlert
                                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                                    size={22}/>
                                <div>
                                    <h2 className="font-semibold text-red-700 dark:text-red-400">
                                        Access Restricted
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-red-600 dark:text-red-300">
                                        You cannot use your account until the suspension
                                        period ends.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="rounded-2xl border border-border bg-background p-5">
                            <p className="text-sm font-semibold text-muted">
                                Suspension Reason
                            </p>
                            <p className="mt-2 text-base font-medium text-foreground">
                                {user?.suspendedReason}
                            </p>

                        </div>

                        {/* Countdown */}
                        <div className="rounded-2xl border border-border bg-background p-6 text-center">

                            <div className="mb-3 flex items-center justify-center gap-2">
                                <Clock
                                    size={20}
                                    className="text-primary"
                                />

                                <h2 className="font-semibold text-foreground">
                                    Suspension Ends In
                                </h2>
                            </div>

                            {expired ? (
                                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                    Suspension Expired
                                </p>
                            ) : (
                                <p className="text-3xl font-bold tracking-wide text-primary">
                                    {timeLeft}
                                </p>
                            )}

                            <p className="mt-3 text-sm text-muted">
                                {new Date(suspendedUntil).toLocaleString()}
                            </p>

                        </div>

                        {/* Assistance */}
                        <div className="rounded-2xl border border-border bg-background p-5">

                            <div className="flex gap-4">

                                <HelpCircle
                                    className="mt-0.5 shrink-0 text-primary"
                                    size={22}
                                />

                                <div>
                                    <h2 className="font-semibold text-foreground">
                                        Need Assistance?
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-muted">
                                        If you believe this suspension was made in error,
                                        please contact the administrator for assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}