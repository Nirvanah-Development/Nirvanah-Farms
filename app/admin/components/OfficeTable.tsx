"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, MapPin, Users, Building, Calendar, Target, Package } from "lucide-react";
import { BulkActions } from "./BulkActions";
import { DeleteOfficeDialog } from "./DeleteOfficeDialog";
import Link from "next/link";
import { format } from "date-fns";

interface Office {
  _id: string;
  officeName: string;
  location: string;
  locationUrl?: string;
  officeCode: string;
  employees: number;
  charitable: number;
  orders?: number;
  target?: string;
  status: string;
  shipDate: string;
  isActive: boolean;
  image?: any;
}

interface OfficeTableProps {
  offices: Office[];
}

export function OfficeTable({ offices }: OfficeTableProps) {
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [deleteOfficeId, setDeleteOfficeId] = useState<string | null>(null);

  const toggleOffice = (officeId: string) => {
    setSelectedOffices((prev) =>
      prev.includes(officeId)
        ? prev.filter((id) => id !== officeId)
        : [...prev, officeId]
    );
  };

  const toggleAll = () => {
    if (selectedOffices.length === offices.length) {
      setSelectedOffices([]);
    } else {
      setSelectedOffices(offices.map((office) => office._id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      gifted: { label: "Gifted", className: "bg-blue-100 text-blue-800" },
      processing: { label: "Processing", className: "bg-gray-100 text-gray-800" },
      donated: { label: "Donated", className: "bg-green-100 text-green-800" },
      target_filled: { label: "Target filled", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;

    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Mobile Card Component
  const MobileOfficeCard = ({ office }: { office: Office }) => (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={selectedOffices.includes(office._id)}
            onCheckedChange={() => toggleOffice(office._id)}
          />
          <div className="flex items-center gap-3 flex-1">
            {office.image && (
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{office.officeName}</h3>
              <p className="text-sm text-gray-500 font-mono">{office.officeCode}</p>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/offices/${office._id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setDeleteOfficeId(office._id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{office.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{office.employees} employees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="w-4 h-4" />
            <span>{office.charitable} charitable</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span>{office.orders || "-"} orders</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>{office.target || "-"} target</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{format(new Date(office.shipDate), "d MMM")}</span>
          </div>
          {getStatusBadge(office.status)}
        </div>

        {office.locationUrl && (
          <a
            href={office.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline block truncate"
          >
            {office.locationUrl}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="p-3 sm:p-4 border-b">
        <BulkActions
          selectedOffices={selectedOffices}
          onComplete={() => setSelectedOffices([])}
        />
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {offices.length} offices
            </span>
            <Checkbox
              checked={selectedOffices.length === offices.length && offices.length > 0}
              onCheckedChange={toggleAll}
            />
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {offices.map((office) => (
            <MobileOfficeCard key={office._id} office={office} />
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOffices.length === offices.length && offices.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>office name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">employee</TableHead>
              <TableHead className="text-center">charitable</TableHead>
              <TableHead className="text-center">office code</TableHead>
              <TableHead className="text-center">orders</TableHead>
              <TableHead className="text-center">target</TableHead>
              <TableHead>status</TableHead>
              <TableHead>ship date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offices.map((office) => (
              <TableRow key={office._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOffices.includes(office._id)}
                    onCheckedChange={() => toggleOffice(office._id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {office.image && (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-lg">🏢</span>
                      </div>
                    )}
                    <div>
                      <div>{office.officeName}</div>
                      {office.locationUrl && (
                        <a
                          href={office.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {office.locationUrl}
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{office.location}</TableCell>
                <TableCell className="text-center">{office.employees}</TableCell>
                <TableCell className="text-center">{office.charitable}</TableCell>
                <TableCell className="text-center font-mono">{office.officeCode}</TableCell>
                <TableCell className="text-center">{office.orders || "-"}</TableCell>
                <TableCell className="text-center">{office.target || "-"}</TableCell>
                <TableCell>{getStatusBadge(office.status)}</TableCell>
                <TableCell>{format(new Date(office.shipDate), "d MMM")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offices/${office._id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteOfficeId(office._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteOfficeDialog
        officeId={deleteOfficeId}
        onClose={() => setDeleteOfficeId(null)}
      />
    </>
  );
} 