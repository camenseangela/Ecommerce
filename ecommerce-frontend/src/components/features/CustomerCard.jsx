import { Button } from '../ui';

export function CustomerCard({ customer, onEdit, onDelete, onView }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">👤 {customer.first_name} {customer.last_name}</h3>
          <p className="text-gray-600 text-sm">ID: #{customer.customer_id}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <p className="text-gray-700"><span className="font-semibold">Phone:</span> {customer.phone_no}</p>
        <p className="text-gray-700"><span className="font-semibold">Address:</span> {customer.address}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(customer)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(customer.customer_id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}