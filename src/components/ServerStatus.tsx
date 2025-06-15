
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, WifiHigh, WifiOff } from 'lucide-react';

const ServerStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('http://localhost:3001/api/scores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.log('Server status check failed:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check status on component mount
    checkServerStatus();
    
    // Set up periodic status check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isConnected === null) return 'bg-gray-500';
    return isConnected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking...';
    if (isConnected === null) return 'Unknown';
    return isConnected ? 'Connected' : 'Offline';
  };

  const getStatusIcon = () => {
    if (isConnected === null || isChecking) return <Server size={16} />;
    return isConnected ? <WifiHigh size={16} /> : <WifiOff size={16} />;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium text-gray-900">Local Server</p>
              <p className="text-xs text-gray-500">localhost:3001</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${getStatusColor()} text-white`}
            >
              {getStatusText()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkServerStatus}
              disabled={isChecking}
            >
              Check
            </Button>
          </div>
        </div>
        
        {isConnected === false && (
          <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
            Server not accessible. Make sure your local server is running on port 3001.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatus;
