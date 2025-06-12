interface EditOfficePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOfficePage({ params }: EditOfficePageProps) {
  const { id } = await params;
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Office</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-600">
          Office edit form will be implemented here for office ID: {id}
        </p>
      </div>
    </div>
  );
} 