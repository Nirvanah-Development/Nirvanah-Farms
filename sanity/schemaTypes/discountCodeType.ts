import { defineField, defineType } from "sanity";

export const discountCodeType = defineType({
  name: "discountCode",
  title: "Discount Code",
  type: "document",
  fields: [
    defineField({
      name: "code",
      title: "Discount Code",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(20),
      description: "The discount code that customers will enter (case sensitive)",
    }),
    defineField({
      name: "name",
      title: "Code Name/Description",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Internal name to identify this discount code",
    }),
    defineField({
      name: "percentageOff",
      title: "Percentage Off",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(100),
      description: "Percentage discount (1-100)",
    }),
    defineField({
      name: "maxUsageCount",
      title: "Maximum Usage Count",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
      description: "How many times this code can be used in total",
    }),
    defineField({
      name: "currentUsageCount",
      title: "Current Usage Count",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "How many times this code has been used",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      description: "When this discount code becomes active",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      description: "When this discount code expires",
    }),
    defineField({
      name: "applicableProducts",
      title: "Applicable Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description: "Select products this discount applies to. Leave empty to apply to all products.",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      description: "Enable or disable this discount code",
    }),
  ],
  preview: {
    select: {
      title: "code",
      subtitle: "name",
      percentageOff: "percentageOff",
      isActive: "isActive",
      currentUsage: "currentUsageCount",
      maxUsage: "maxUsageCount",
    },
    prepare(selection) {
      const { title, subtitle, percentageOff, isActive, currentUsage, maxUsage } = selection;
      return {
        title: `${title} (${percentageOff}% off)`,
        subtitle: `${subtitle} - ${isActive ? 'Active' : 'Inactive'} - Used: ${currentUsage}/${maxUsage}`,
      };
    },
  },
}); 