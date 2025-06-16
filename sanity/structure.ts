import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Nirvanah MS')
    .items([
      // Inventory Section
      S.listItem()
        .title('📦 Inventory')
        .child(
          S.list()
            .title('Inventory Management')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('category').title('Categories'),
            ])
        ),

      // Orders Section
      S.documentTypeListItem('order').title('🛒 Orders'),

      // Office Management (Admin Only)
      S.listItem()
        .title('🏢 Offices')
        .child(
          S.list()
            .title('Office Management')
            .items([
              S.documentTypeListItem('office').title('All Partner Offices'),
              S.listItem()
                .title('Gifted Offices')
                .child(
                  S.documentTypeList('office')
                    .title('Gifted Offices')
                    .filter('status == "gifted"')
                ),
              S.listItem()
                .title('Processing Offices')
                .child(
                  S.documentTypeList('office')
                    .title('Processing Offices')
                    .filter('status == "processing"')
                ),
              S.listItem()
                .title('Donated Offices')
                .child(
                  S.documentTypeList('office')
                    .title('Donated Offices')
                    .filter('status == "donated"')
                ),
              S.listItem()
                .title('Target Filled Offices')
                .child(
                  S.documentTypeList('office')
                    .title('Target Filled Offices')
                    .filter('status == "target_filled"')
                ),
            ])
        ),

      // Settings Section
      S.listItem()
        .title('⚙️ Settings')
        .child(
          S.list()
            .title('System Settings')
            .items([
              S.documentTypeListItem('address').title('Addresses'),
              S.documentTypeListItem('careerEmail').title('Career Email Subscriptions'),
              S.documentTypeListItem('contactMessage').title('Contact Messages'),
            ])
        ),

      // Divider
      S.divider(),

      // All Documents (for advanced users)
      ...S.documentTypeListItems().filter(
        (listItem) => !['product', 'category', 'order', 'office', 'address', 'careerEmail', 'contactMessage'].includes(listItem.getId() || '')
      ),
    ])
