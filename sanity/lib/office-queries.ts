import { groq } from "next-sanity";
import { client } from "./client";
import { backendClient } from "./backendClient";

export const officesQuery = groq`
  *[_type == "office"] | order(shipDate desc) {
    _id,
    officeName,
    location,
    locationUrl,
    officeCode,
    employees,
    charitable,
    orders,
    target,
    status,
    shipDate,
    isActive,
    image
  }
`;

export const searchOfficesQuery = groq`
  *[_type == "office" && officeCode match $searchTerm + "*"] | order(shipDate desc) {
    _id,
    officeName,
    location,
    locationUrl,
    officeCode,
    employees,
    charitable,
    orders,
    target,
    status,
    shipDate,
    isActive,
    image
  }
`;

// Query to get all office codes for next code generation
export const officeCodesQuery = groq`*[_type == "office"]{officeCode}`;

export async function getOffices() {
  return await client.fetch(officesQuery);
}

export async function searchOffices(searchTerm: string) {
  return await client.fetch(searchOfficesQuery, { searchTerm });
}

export async function getExistingOfficeCodes(): Promise<string[]> {
  const offices = await client.fetch(officeCodesQuery);
  return offices.map((office: { officeCode: string }) => office.officeCode);
}

export async function getOfficeById(officeId: string) {
  const query = groq`*[_type == "office" && _id == $officeId][0]{
    _id,
    officeName,
    location,
    locationUrl,
    phone,
    email,
    officeCode,
    employees,
    charitable,
    orders,
    target,
    status,
    shipDate,
    isActive,
    image,
    description,
    supportStaff
  }`;
  
  return await client.fetch(query, { officeId });
}

export async function createOffice(officeData: {
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
  description?: string;
  images?: any[];
  supportStaff?: { name: string }[];
}) {
  const doc = {
    _type: 'office',
    ...officeData,
    isActive: true,
    ...(officeData.images && officeData.images.length > 0 && {
      image: officeData.images[0] // Use first image as main image
    })
  };

  return await backendClient.create(doc);
}

export async function updateOfficeStatus(officeIds: string[], status: string) {
  const transaction = backendClient.transaction();
  
  officeIds.forEach((id) => {
    transaction.patch(id, { set: { status } });
  });
  
  return await transaction.commit();
}

export async function updateOffice(officeId: string, officeData: {
  officeName: string;
  location: string;
  locationUrl?: string;
  phone?: string;
  email?: string;
  employees: number;
  charitable: number;
  orders?: number;
  target?: string;
  shipDate: string;
  description?: string;
  supportStaff?: { name: string }[];
}) {
  return await backendClient.patch(officeId).set(officeData).commit();
}

export async function deleteOffice(officeId: string) {
  return await backendClient.delete(officeId);
} 