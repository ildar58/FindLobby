import {Pipe, PipeTransform} from '@angular/core';
import {UniMapper} from '../types/mapper.type';

@Pipe({name: 'uniMapper'})
export class UniMapperPipe implements PipeTransform {
    /**
     * Maps object to an arbitrary result through a mapper function
     *
     * @param value an item to transform
     * @param mapper a mapping function
     * @param args arbitrary number of additional arguments
     */
    transform<T, G>(value: T, mapper: UniMapper<T, G>, ...args: any[]): G {
        return mapper(value, ...args);
    }
}
