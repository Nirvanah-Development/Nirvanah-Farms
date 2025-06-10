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
              S.documentTypeListItem('brand').title('Brands'),
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

      // Blog Section
      S.listItem()
        .title('📝 Blog')
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.documentTypeListItem('blog').title('Blog Posts'),
              S.documentTypeListItem('blogCategory').title('Blog Categories'),
              S.documentTypeListItem('author').title('Authors'),
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
            ])
        ),

      // Divider
      S.divider(),

      // All Documents (for advanced users)
      S.listItem()
        .title('🗂️ All Documents')
        .child(S.documentTypeListItems()),
    ])
