import type { AccessorySubtype, Category } from '../types'
import blueJeans from '../assets/samples/jean.jpg'
import redDress from '../assets/samples/red-dress.jpg'
import redSneakers from '../assets/samples/red-sneakers.png'
import whiteCap from '../assets/samples/white-cap.png'
import whiteTee from '../assets/samples/white-tee.png'

export const EXAMPLE_CLOTHES: {
  file: string
  name: string
  category: Category
  accessorySubtype: AccessorySubtype
}[] = [
  {
    file: whiteTee,
    name: 'White tee',
    category: 'top',
    accessorySubtype: 'other',
  },
  {
    file: blueJeans,
    name: 'Blue jeans',
    category: 'bottom',
    accessorySubtype: 'other',
  },
  {
    file: redDress,
    name: 'Red gown',
    category: 'dress',
    accessorySubtype: 'other',
  },
  {
    file: redSneakers,
    name: 'Red sneakers',
    category: 'shoes',
    accessorySubtype: 'other',
  },
  {
    file: whiteCap,
    name: 'White cap',
    category: 'accessory',
    accessorySubtype: 'hat',
  },
]
