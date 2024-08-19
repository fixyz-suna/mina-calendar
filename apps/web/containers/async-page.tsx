"use client";
import { Calendar } from "@/components/calendar";
import { useWalletStore } from "@/lib/stores/wallet";
import { useEffect, useState } from "react";

export default function Home() {
  const wallet = useWalletStore();
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check-google-calendar')
      .then(res => res.json())
      .then(data => {
        if (data.isConnected) {
          setIsGoogleConnected(true);
        }
      })
      .catch(error => console.error('Google Calendarの接続確認中にエラーが発生しました:', error));
  }, []);

  const onConnectGoogleCalendar = async () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="mx-auto -mt-32 h-full pt-16">
      <div className="flex h-full w-full items-center justify-center pt-16">
        <div className="flex basis-4/12 flex-col items-center justify-center 2xl:basis-3/12">
          <Calendar
            wallet={wallet.wallet}
            onConnectWallet={wallet.connectWallet}
            onConnectGoogleCalendar={onConnectGoogleCalendar}
            loading={false}
            isGoogleConnected={isGoogleConnected}
            setGoogleConnected={setIsGoogleConnected}
          />
        </div>
      </div>
    </div>
  );
}