import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface Order {
  id: string;
  customer: Customer;
  date: string;
  items: OrderItem[];
  total: number;
  shipping: {
    method: string;
    cost: number;
    tracking?: string;
    carrier: string;
  };
  status: string;
}

export const generateInvoicePDF = (order: Order): Promise<Blob> => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Add order information
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 20, 40);
    doc.text(`Date: ${format(new Date(order.date), 'PPP')}`, 20, 45);
    doc.text(`Status: ${order.status}`, 20, 50);
    
    // Add customer information
    doc.text('Bill To:', 20, 65);
    doc.text(order.customer.name, 20, 70);
    doc.text(order.customer.address.street, 20, 75);
    doc.text(`${order.customer.address.city}, ${order.customer.address.state} ${order.customer.address.zip}`, 20, 80);
    doc.text(order.customer.address.country, 20, 85);
    
    // Add items table
    const tableData = order.items.map(item => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`
    ]);
    
    (doc as any).autoTable({
      startY: 100,
      head: [['Item', 'Quantity', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Subtotal:', 140, finalY);
    doc.text(`$${order.total.toFixed(2)}`, 170, finalY, { align: 'right' });
    
    doc.text('Shipping:', 140, finalY + 5);
    doc.text(`$${order.shipping.cost.toFixed(2)}`, 170, finalY + 5, { align: 'right' });
    
    doc.text('Total:', 140, finalY + 10);
    doc.text(`$${(order.total + order.shipping.cost).toFixed(2)}`, 170, finalY + 10, { align: 'right' });
    
    // Add footer
    doc.setFontSize(8);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    
    resolve(doc.output('blob'));
  });
};

export const sendOrderEmail = async (
  type: 'confirmation' | 'shipping' | 'delivered',
  order: Order
): Promise<void> => {
  // In a real application, you would integrate with an email service like SendGrid, AWS SES, etc.
  const emailTemplates = {
    confirmation: {
      subject: `Order Confirmation - ${order.id}`,
      body: `
        Dear ${order.customer.name},
        
        Thank you for your order! We're pleased to confirm that your order ${order.id} has been received and is being processed.
        
        Order Details:
        - Order ID: ${order.id}
        - Date: ${format(new Date(order.date), 'PPP')}
        - Total: $${(order.total + order.shipping.cost).toFixed(2)}
        
        You can track your order status at any time by logging into your account.
        
        Best regards,
        Your Store Team
      `
    },
    shipping: {
      subject: `Your Order ${order.id} Has Been Shipped`,
      body: `
        Dear ${order.customer.name},
        
        Great news! Your order ${order.id} has been shipped.
        
        Tracking Information:
        - Carrier: ${order.shipping.carrier}
        - Tracking Number: ${order.shipping.tracking}
        
        Estimated delivery: 3-5 business days
        
        Best regards,
        Your Store Team
      `
    },
    delivered: {
      subject: `Order ${order.id} Delivered - How Did We Do?`,
      body: `
        Dear ${order.customer.name},
        
        Your order ${order.id} has been delivered. We hope you're enjoying your purchase!
        
        Please take a moment to rate your experience and leave a review.
        
        Best regards,
        Your Store Team
      `
    }
  };

  const template = emailTemplates[type];
  
  // Simulate API call to email service
  console.log('Sending email:', {
    to: order.customer.email,
    subject: template.subject,
    body: template.body
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};
