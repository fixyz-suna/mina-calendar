"use client";
import { Card } from "@/components/ui/card";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { useState } from "react";

export interface FaucetProps {
  wallet?: string;
  loading: boolean;
  onConnectWallet: () => void;
  onConnectGoogleCalendar: () => void;
}

export function Faucet({
  wallet,
  onConnectWallet,
  onConnectGoogleCalendar,
  loading,
}: FaucetProps) {
  const form = useForm();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  const handleButtonClick = () => {
    if (!wallet) {
      onConnectWallet();
    } else if (!isGoogleConnected) {
      onConnectGoogleCalendar();
      setIsGoogleConnected(true);
    }
  };

  return (
    <Card className="w-full p-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold">Minna no Calendar</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Share schedules while maintaining privacy
        </p>
      </div>
      <Form {...form}>
        <Button
          size={"lg"}
          type="submit"
          className="mt-6 w-full"
          loading={loading}
          onClick={handleButtonClick}
        >
          {wallet ? (isGoogleConnected ? "Google Calendar Connected" : "Connect Google Calendar") : "Connect Wallet"}
        </Button>
      </Form>
    </Card>
  );
}
