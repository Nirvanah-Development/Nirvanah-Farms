"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function MigrateOrdersPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');
  const [results, setResults] = useState<{
    total: number;
    fixed: number;
    errors: string[];
  }>({ total: 0, fixed: 0, errors: [] });

  const handleMigration = async () => {
    setStatus('checking');
    setResults({ total: 0, fixed: 0, errors: [] });

    try {
      const response = await fetch('/api/admin/check-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to migrate orders');
      }

      const result = await response.json();
      setResults(result);
      setStatus('completed');
    } catch (error) {
      console.error('Migration error:', error);
      setResults(prev => ({
        ...prev,
        errors: [...prev.errors, error instanceof Error ? error.message : 'Unknown error']
      }));
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <RefreshCw className="text-blue-600" size={32} />
        <h1 className="text-2xl font-bold">Migrate Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="text-orange-500" size={20} />
            Fix Missing Product Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This tool will fix orders that have missing <code>_key</code> properties in their products arrays, 
            which causes &quot;missing keys&quot; errors in Sanity Studio.
          </p>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleMigration}
              disabled={status === 'checking' || status === 'migrating'}
              className="flex items-center gap-2"
            >
              {status === 'checking' || status === 'migrating' ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  {status === 'checking' ? 'Checking...' : 'Migrating...'}
                </>
              ) : (
                'Start Migration'
              )}
            </Button>

            {status !== 'idle' && (
              <Badge variant={
                status === 'completed' ? 'default' : 
                status === 'error' ? 'destructive' : 'secondary'
              }>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            )}
          </div>

          {(status === 'completed' || status === 'error') && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {status === 'completed' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                  Migration Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Total Orders Checked:</span>
                    <span className="ml-2">{results.total}</span>
                  </div>
                  <div>
                    <span className="font-medium">Orders Fixed:</span>
                    <span className="ml-2 text-green-600">{results.fixed}</span>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-red-600 mb-2">Errors:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {status === 'completed' && results.errors.length === 0 && (
                  <div className="text-green-600 font-medium">
                    ✅ Migration completed successfully! All orders now have proper product keys.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What this migration does:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Scans all orders in the database</li>
            <li>Identifies orders with products missing <code>_key</code> properties</li>
            <li>Generates unique <code>_key</code> values for products without them</li>
            <li>Updates the orders in Sanity to fix the &quot;missing keys&quot; error</li>
            <li>Provides a detailed report of what was fixed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 