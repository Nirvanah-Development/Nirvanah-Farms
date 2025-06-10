import { groq } from "next-sanity";
import { client } from "./client";

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

export async function getOffices() {
  return await client.fetch(officesQuery);
}

export async function searchOffices(searchTerm: string) {
  return await client.fetch(searchOfficesQuery, { searchTerm });
}

export async function updateOfficeStatus(officeIds: string[], status: string) {
  const transaction = client.transaction();
  
  officeIds.forEach((id) => {
    transaction.patch(id, { set: { status } });
  });
  
  return await transaction.commit();
}

export async function deleteOffice(officeId: string) {
  return await client.delete(officeId);
} 