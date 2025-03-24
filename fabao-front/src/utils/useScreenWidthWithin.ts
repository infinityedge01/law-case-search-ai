import { useEffect, useRef, useState } from 'react';

/**
 * Use if the screen width is in [`l`, `r`)
 *
 * @note `l` and `r` must be constant values.
 */
export function useScreenWidthWithin(l: number, r: number): boolean {
    const refMediaQueryList = useRef<MediaQueryList>(
        Number.isFinite(r)
        ? window.matchMedia(
            [
                `only screen`,
                `(min-width: ${l}px)`,
                `(max-width: ${r - 1}px)`,
            ].join(' and ')
        )
        : window.matchMedia([`only screen`, `(min-width: ${l}px)`].join(' and '))
    );

    const [result, setResult] = useState(refMediaQueryList.current.matches);

    useEffect(() => {
        function onChange(e: MediaQueryListEvent) {
            setResult(e.matches);
        }
        refMediaQueryList.current.addEventListener('change', onChange);
        return () => refMediaQueryList.current.removeEventListener('change', onChange);
    }, []);

    return result;
}

export default useScreenWidthWithin;