import {UniStringHandler} from './handler.type';
import {UniMapper} from './mapper.type';

/**
 * A matcher function to test items against with extra arguments.
 */
export type UniMatcher<I> = UniMapper<I, boolean>;

export type UniStringMatcher<I> = (
    item: I,
    matchValue: string,
    stringify: UniStringHandler<I>
) => boolean;

export type UniIdentityMatcher<I> = (item1: I, item2: I) => boolean;
