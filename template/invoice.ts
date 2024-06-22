import { Order } from "src/module/order/entities/order.entity";

export function generateMarkdownInvoice(tran_id: string, invoiceData: Order) {

   const header = `*****🚨Order Alert: Action Required*****
***🧾Order Details ***
- ** Order ID:** ${tran_id}
- ** Order Date:** ${'`June 20, 2024`'}
- ** Buyer Name:** ${'`John Doe`'}
- ** Shipping Address:** ${`123 Main St, Springfield, IL 62704`}

***🛒Items Ordered ***
`

   const footer = `***💰Total Order Value: $${invoiceData?.total} ***

      [Website](https://www.soklay.site)`

   let invoice: string;
   invoiceData?.item?.map((item) => {
      invoice += `
   1. ** Item:** ${item.product?.name}
   - ** Quantity:** ${item?.quantity}
   - ** Option:** ${item?.productOption?.name} +$ ${item?.productOption?.priceIncrement}
   - ** Price:** $${item?.amount}`

   })

   return header + invoice + footer
}