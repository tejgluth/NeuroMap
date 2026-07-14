import {
  Coffee,
  Popcorn,
  Scissors,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Stethoscope,
  Trees,
  Utensils,
  Waves,
} from 'lucide-react'

import type { CategoryId } from '../../types'
import { cn } from '../../lib/cn'

export default function CategoryIcon({
  categoryId,
  className,
}: {
  categoryId: CategoryId
  className?: string
}) {
  const props = { className: cn('h-4 w-4', className), 'aria-hidden': true as const }
  switch (categoryId) {
    case 'restaurant':
      return <Utensils {...props} />
    case 'cafe':
      return <Coffee {...props} />
    case 'park':
      return <Trees {...props} />
    case 'grocery':
      return <ShoppingCart {...props} />
    case 'beach':
      return <Waves {...props} />
    case 'entertainment':
      return <Popcorn {...props} />
    case 'retail':
      return <ShoppingBag {...props} />
    case 'salon':
      return <Scissors {...props} />
    case 'doctor':
      return <Stethoscope {...props} />
    case 'dentist':
      return <Smile {...props} />
  }
}
