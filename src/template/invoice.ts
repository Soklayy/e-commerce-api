import { Order } from "src/module/order/entities/order.entity";

export function generateMarkdownInvoice(invoiceData: Order) {

   const header = `*****🚨Order Alert: Action Required*****
***🧾Order Details ***
- ** Order ID:** ${invoiceData?.tranId}
- ** Order Date:** ${invoiceData?.createdAt}
- ** Buyer Name:** ${invoiceData?.user?.firstname} ${invoiceData?.user?.lastname}
- ** Shipping Address:** ${`123 Main St, Springfield, IL 62704`}
- ** phone : ${invoiceData?.user?.address?.phone || '0187737519'}

***🛒Items Ordered ***
`

   const footer = `***💰Total Order Value: $${invoiceData?.total} ***

      [Website](https://www.soklay.site)`

   let invoice: string;
   invoiceData?.item?.map((item) => {
      invoice += `
   1. ** Item:** ${item.product?.name}
   - ** Quantity:** ${item?.quantity}
   - ** Option:** ${item?.productOption?.name || null} $${item?.productOption?.priceIncrement || 0}
   - ** Price:** $${item?.amount}`

   })

   return header + invoice + footer
}