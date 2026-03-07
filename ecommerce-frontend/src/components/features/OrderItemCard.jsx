import { Button } from '../ui';

export function OrderItemCard({ item, onEdit, onDelete, products = [] }) {
  // Logic to find product details
  const product = products.find(p => p.product_id === item.product);
  const productName = product?.p_name || `Product #${item.product}`;
  const price = product?.price || 0;
  const subtotal = price * item.order_quantity;

  return (
    <div className="card">
      {/* Top Section - Matching OrderCard Header Style */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg" title={productName}>
            📦 {productName}
          </h3>
          <p className="text-gray-600 text-sm">Item ID: {item.orderitems_id}</p>
        </div>
        {/* Using a simple div badge style to match the Badge feel */}
        <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-bold">
          Qty: {item.order_quantity}
        </div>
      </div>

      {/* Info Section - Matching OrderCard Details & Border */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order Ref:</span>
          <span className="font-medium">#{item.order}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-medium">₱{parseFloat(price).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-bold text-secondary">
            ₱{parseFloat(subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Action Buttons - Matching OrderCard Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1" 
          onClick={() => onEdit(item)}
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          className="flex-1" 
          onClick={() => onDelete(item.orderitems_id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}