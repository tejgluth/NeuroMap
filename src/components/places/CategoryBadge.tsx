import type { CategoryId } from '../../types'
import { CATEGORY_BY_ID } from '../../data/categories'
import CategoryIcon from './CategoryIcon'
import Badge from '../ui/Badge'

export default function CategoryBadge({ categoryId }: { categoryId: CategoryId }) {
  const category = CATEGORY_BY_ID[categoryId]
  return (
    <Badge className="bg-sand-100">
      <CategoryIcon categoryId={categoryId} className="text-brand-700" />
      {category.label}
    </Badge>
  )
}

