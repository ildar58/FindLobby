import {Observable, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export function createTimer(
    startTime: number,
    endTime: number
): Observable<number> {
    startTime *= 1000;
    endTime = endTime * 1000 + 1000;

    return timer(startTime, 1000).pipe(takeUntil(timer(endTime)));
}
