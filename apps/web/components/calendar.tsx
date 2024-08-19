"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { generateProof } from '../lib/zkUtils';
import { Field, PublicKey, Mina, AccountUpdate, UInt64 } from 'o1js';

export interface CalendarProps {
  wallet?: string;
  loading: boolean;
  onConnectWallet: () => void;
  onConnectGoogleCalendar: () => void;
  isGoogleConnected: boolean;
  setGoogleConnected: (connected: boolean) => void;
}

interface TimeRange {
  start: string;
  end: string;
}

export function Calendar({
  wallet,
  onConnectWallet,
  onConnectGoogleCalendar,
  loading,
  isGoogleConnected,
  setGoogleConnected,
}: CalendarProps) {
  const form = useForm();
  const [freeTimes, setFreeTimes] = useState<TimeRange[]>([]);

  useEffect(() => {
    const checkGoogleConnection = async () => {
      try {
        const response = await fetch('/api/auth/check-google-calendar');
        const data = await response.json();
        if (data.isConnected) {
          setGoogleConnected(true);
        }
      } catch (error) {
        console.error("Google Calendar接続の確認に失敗しました:", error);
      }
    };

    const fetchFreeTimes = async () => {
      try {
        const response = await fetch('/api/calendar/freebusy');
        const data = await response.json();
        setFreeTimes(data.freeTimes);
      } catch (error) {
        console.error("空き時間の取得に失敗しました:", error);
      }
    };

    if (isGoogleConnected) {
      fetchFreeTimes();
    } else {
      checkGoogleConnection();
    }
  }, [isGoogleConnected, setGoogleConnected]);

  const handleButtonClick = () => {
    if (!wallet) {
      onConnectWallet();
    } else if (!isGoogleConnected) {
      onConnectGoogleCalendar();
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const saveFreeTimes = async () => {
    if (freeTimes.length > 0 && wallet) {
      try {
        const { hash, proof } = generateProof(freeTimes);

        const contractAddress = PublicKey.fromBase58("B62qqtxQdPa9MrDsHHRdgNsecRE2SCYBA4YkCEZ7NQ29KrpAsfPtKBW");

        const txn = await Mina.transaction(wallet, async () => {
          const update = AccountUpdate.create(contractAddress);
          update.update({ field: 'numFreeTimes', value: hash });
          update.requireSignature();
        });

        await txn.prove();
        await txn.sign([wallet]);
        await txn.send();

        console.log('空き時間がゼロ知識証明で保存されました');
      } catch (error) {
        console.error('空き時間の保存中にエラーが発生しました:', error);
      }
    }
  };

  return (
    <Card className="w-full p-4">
      <div className="mb-2">
        <h2 className="text-xl font-bold">Minna no Calendar</h2>
        <p className="mt-1 text-sm text-zinc-500">
          プライバシーを保ちながらスケジュールを共有
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
          {wallet ? (isGoogleConnected ? "Google Calendar 接続済み" : "Google Calendar に接続") : "ウォレットに接続"}
        </Button>
        {isGoogleConnected && (
          <Button
            onClick={saveFreeTimes}
            className="mt-4 w-full"
            disabled={freeTimes.length === 0}
          >
            空き時間をゼロ知識証明で保存
          </Button>
        )}
        {freeTimes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">利用可能な時間枠</h3>
            <ul className="mt-2 space-y-2">
              {freeTimes.map((time, index) => (
                <li key={index} className="text-sm">
                  {formatDateTime(time.start)} - {formatDateTime(time.end)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Form>
    </Card>
  );
}