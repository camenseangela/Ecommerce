import { Button } from '../ui';

export function ProductCard({ product, onEdit, onDelete, onView }) {
  return (
    <div className="card">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900" title={product.p_name}>
            🏷️ {product.p_name}
          </h3>
          <p className="text-gray-500 text-sm">Product ID: {product.product_id}</p>
        </div>
        <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-bold border border-primary/20">
          Stock: {product.quantity}
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
        {/* Description - Switched from italic to light-weight slate text */}
        <p className="text-slate-500 text-sm font-light line-clamp-2 leading-relaxed">
          {product.description || "No description provided."}
        </p>
        
        <div className="flex justify-between text-sm pt-1">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-bold text-secondary">
            ₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="flex-1" 
          onClick={() => onView(product)}
        >
          View
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          className="flex-1" 
          onClick={() => onDelete(product.product_id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}