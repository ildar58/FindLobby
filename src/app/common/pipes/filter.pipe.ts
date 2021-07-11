import {UniMatcher} from '../types/matcher.type';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'uniFilter'})
export class UniFilterPipe implements PipeTransform {
  /**
   * Filters an array through a matcher function using additional arguments
   *
   * @param items array
   * @param matcher method for filtering
   * @param args arbitrary number of additional arguments
   */
  transform<T>(
    items: readonly T[],
    matcher: UniMatcher<T>,
    ...args: any[]
  ): T[] {
    return items.filter(item => matcher(item, ...args));
  }
}
