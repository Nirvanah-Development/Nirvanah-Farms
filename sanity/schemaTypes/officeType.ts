import { defineField, defineType } from 'sanity'

export const officeType = defineType({
  name: 'office',
  title: 'Partner Offices',
  type: 'document',
  icon: () => '🏢',
  fields: [
    defineField({
      name: 'officeName',
      title: 'Office Name',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100)
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'locationUrl',
      title: 'Location URL',
      type: 'url',
      description: 'Maps URL for the office location'
    }),
    defineField({
      name: 'phone',
      title: 'Permanent Phone',
      type: 'string',
      description: 'Office phone number'
    }),
    defineField({
      name: 'email',
      title: 'Permanent Email',
      type: 'string',
      description: 'Office email address'
    }),
    defineField({
      name: 'officeCode',
      title: 'Office Code',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(10)
    }),
    defineField({
      name: 'employees',
      title: 'Number of Employees',
      type: 'number',
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'charitable',
      title: 'Charitable Count',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'orders',
      title: 'Orders',
      type: 'number',
      description: 'Order quantities (e.g., 75)'
    }),
    defineField({
      name: 'target',
      title: 'Target',
      type: 'string',
      description: 'Target quantities (e.g., 125 KG)'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Gifted', value: 'gifted' },
          { title: 'Processing', value: 'processing' },
          { title: 'Donated', value: 'donated' },
          { title: 'Target Filled', value: 'target_filled' }
        ],
        layout: 'radio'
      },
      initialValue: 'processing',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'shipDate',
      title: 'Ship Date',
      type: 'date',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Office Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'supportStaff',
      title: 'Support Staff',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ],
      description: 'List of charitable support staff names'
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'officeName',
      subtitle: 'location',
      media: 'image',
      status: 'status'
    },
    prepare(selection) {
      const { title, subtitle, media, status } = selection
      return {
        title,
        subtitle: `${subtitle} • ${status?.toUpperCase()}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Office Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'officeName', direction: 'asc' }]
    },
    {
      title: 'Office Name Z-A',
      name: 'nameDesc',
      by: [{ field: 'officeName', direction: 'desc' }]
    },
    {
      title: 'Ship Date (Latest First)',
      name: 'shipDateDesc',
      by: [{ field: 'shipDate', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
}) 