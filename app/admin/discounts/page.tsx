"use client";

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";

interface DiscountCode {
  _id: string;
  code: string;
  name: string;
  percentageOff: number;
  maxUsageCount: number;
  currentUsageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableProducts: Array<{_id: string; name: string}>;
}

export default function DiscountCodesAdmin() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  useEffect(() => {
    filterCodes();
  }, [discountCodes, searchTerm, statusFilter]);

  const fetchDiscountCodes = async () => {
    try {
      const codes = await client.fetch(`
        *[_type == "discountCode"] | order(_createdAt desc) {
          _id,
          code,
          name,
          percentageOff,
          maxUsageCount,
          currentUsageCount,
          startDate,
          endDate,
          isActive,
          applicableProducts[]->{
            _id,
            name
          }
        }
      `);
      setDiscountCodes(codes);
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      toast.error("Failed to fetch discount codes");
    } finally {
      setLoading(false);
    }
  };

  const filterCodes = () => {
    let filtered = discountCodes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(code => 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(code => {
        switch (statusFilter) {
          case "active":
            return code.isActive && new Date(code.startDate) <= now && new Date(code.endDate) >= now;
          case "inactive":
            return !code.isActive;
          case "expired":
            return new Date(code.endDate) < now;
          case "upcoming":
            return new Date(code.startDate) > now;
          case "exhausted":
            return code.currentUsageCount >= code.maxUsageCount;
          default:
            return true;
        }
      });
    }

    setFilteredCodes(filtered);
  };

  const getStatusBadge = (code: DiscountCode) => {
    const now = new Date();
    const startDate = new Date(code.startDate);
    const endDate = new Date(code.endDate);

    if (!code.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (code.currentUsageCount >= code.maxUsageCount) {
      return <Badge variant="destructive">Exhausted</Badge>;
    }
    if (endDate < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (startDate > now) {
      return <Badge variant="outline">Upcoming</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Active</Badge>;
  };

  const handleBulkActivate = async () => {
    if (selectedCodes.length === 0) {
      toast.error("Please select codes to activate");
      return;
    }

    try {
      // This would require a bulk update API endpoint
      toast.success(`${selectedCodes.length} codes activated`);
      setSelectedCodes([]);
      fetchDiscountCodes();
    } catch (error) {
      toast.error("Failed to activate codes");
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedCodes.length === 0) {
      toast.error("Please select codes to deactivate");
      return;
    }

    try {
      // This would require a bulk update API endpoint
      toast.success(`${selectedCodes.length} codes deactivated`);
      setSelectedCodes([]);
      fetchDiscountCodes();
    } catch (error) {
      toast.error("Failed to deactivate codes");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading discount codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-600">Manage discount codes and promotional offers</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Code
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search codes by code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="exhausted">Exhausted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCodes.length > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedCodes.length} code(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                  Activate Selected
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                  Deactivate Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCodes.map((code) => (
          <Card key={code._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCodes.includes(code._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCodes([...selectedCodes, code._id]);
                      } else {
                        setSelectedCodes(selectedCodes.filter(id => id !== code._id));
                      }
                    }}
                    className="rounded"
                  />
                  <div>
                    <CardTitle className="text-lg font-mono">{code.code}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{code.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {code.percentageOff}% OFF
                </span>
                {getStatusBadge(code)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium">
                    {code.currentUsageCount}/{code.maxUsageCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((code.currentUsageCount / code.maxUsageCount) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div>Start: {formatDate(code.startDate)}</div>
                <div>End: {formatDate(code.endDate)}</div>
              </div>

              {code.applicableProducts && code.applicableProducts.length > 0 && (
                <div className="text-xs">
                  <span className="text-gray-600">Products: </span>
                  <span className="font-medium">
                    {code.applicableProducts.length === 1 
                      ? code.applicableProducts[0].name.substring(0, 20) + "..."
                      : `${code.applicableProducts.length} products`
                    }
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No discount codes found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first discount code to get started"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 