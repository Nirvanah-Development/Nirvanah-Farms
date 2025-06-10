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
import { MoreVertical, Edit, Trash2 } from "lucide-react";
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
  orders?: string;
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

  return (
    <>
      <div className="p-4 border-b">
        <BulkActions
          selectedOffices={selectedOffices}
          onComplete={() => setSelectedOffices([])}
        />
      </div>

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

      <DeleteOfficeDialog
        officeId={deleteOfficeId}
        onClose={() => setDeleteOfficeId(null)}
      />
    </>
  );
} 