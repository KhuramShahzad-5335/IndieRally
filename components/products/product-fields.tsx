import { FormSection } from "@/components/forms/form-section";
import { categories, plans, type Input } from "@/lib/domain";

export function ProductFields({ item }: { item?: Input }) {
  return <>
    <FormSection number="01" title="Product details">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Product name<input name="name" required minLength={2} maxLength={50} defaultValue={item?.name} placeholder="e.g. Framepad"/></label>
        <label>Maker or team<input name="maker" required minLength={2} maxLength={60} defaultValue={item?.maker} placeholder="Your name or studio"/></label>
      </div>
      <label>Product website<input name="website" type="url" required maxLength={500} defaultValue={item?.website} placeholder="https://yourproduct.com"/></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>Category<select name="category" required defaultValue={item?.category ?? ""}><option value="">Choose a category</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label>Pricing<select name="pricing" required defaultValue={item?.pricing ?? ""}><option value="">Choose pricing</option>{plans.map(plan => <option key={plan}>{plan}</option>)}</select></label>
      </div>
    </FormSection>
    <FormSection number="02" title="Listing copy">
      <label>Tagline<input name="tagline" required minLength={8} maxLength={100} defaultValue={item?.tagline} placeholder="What does your product do in one sentence?"/></label>
      <label>Description<textarea name="description" required minLength={30} maxLength={3000} rows={5} defaultValue={item?.description} placeholder="Who is it for, what does it help them do, and how can they get started?"/></label>
    </FormSection>
  </>;
}
