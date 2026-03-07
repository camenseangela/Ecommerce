import { Badge, Button } from '../ui';

export function OrderCard({ order, onEdit, onDelete, onView }) {
  const statusColors = {
    'Pending': 'warning',
    'Completed': 'secondary',
    'Cancelled': 'danger',
    'Processing': 'primary',
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">📋 Order #{order.order_id}</h3>
          <p className="text-gray-600 text-sm">Customer ID: {order.customer}</p>
        </div>
        <Badge variant={statusColors[order.status] || 'primary'}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{order.order_date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-secondary">${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(order)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(order.order_id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}