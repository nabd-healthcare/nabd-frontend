/**
 * PriceSlider Component
 * A clean, smoothly synchronized price range slider
 * 
 * Features:
 * - Immediate visual feedback (local state)
 * - onChangeComplete pattern for API calls 
 * - Smooth slider interaction without lag
 */

import { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const PriceSlider = ({
    value = [0, 1000],
    onChange,
    min = 0,
    max = 1000
}) => {
    // Local state for immediate visual feedback
    const [localValue, setLocalValue] = useState(value);

    // Sync local value when prop changes (e.g., reset filters)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    /**
     * Handle slider change
     * - Updates local state immediately for smooth UX
     */
    const handleSliderChange = (newValue) => {
        setLocalValue(newValue);
    };

    /**
     * Handle drag complete
     * - Fires API call once thumb drag completes
     */
    const handleSliderComplete = (newValue) => {
        onChange([...newValue]);
    };

    return (
        <div className="w-full">
            {/* Price Range Display */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                    <span className="text-xs text-slate-500 block mb-1">من</span>
                    <span className="text-lg font-bold text-[#0070CD]">{localValue[0]}</span>
                    <span className="text-xs text-slate-500 mr-1">جنيه</span>
                </div>
                <div className="flex-1 mx-4 h-px bg-slate-200"></div>
                <div className="text-center">
                    <span className="text-xs text-slate-500 block mb-1">إلى</span>
                    <span className="text-lg font-bold text-[#0070CD]">{localValue[1]}</span>
                    <span className="text-xs text-slate-500 mr-1">جنيه</span>
                </div>
            </div>

            {/* Slider */}
            <div className="px-2">
                <Slider
                    range
                    min={min}
                    max={max}
                    value={localValue}
                    onChange={handleSliderChange}
                    onChangeComplete={handleSliderComplete}
                    trackStyle={[{
                        backgroundColor: '#0070CD',
                        height: 6
                    }]}
                    handleStyle={[
                        {
                            backgroundColor: '#0070CD',
                            borderColor: '#0070CD',
                            width: 20,
                            height: 20,
                            marginTop: -7,
                            boxShadow: '0 2px 8px rgba(0, 112, 205, 0.3)',
                            opacity: 1
                        },
                        {
                            backgroundColor: '#0070CD',
                            borderColor: '#0070CD',
                            width: 20,
                            height: 20,
                            marginTop: -7,
                            boxShadow: '0 2px 8px rgba(0, 112, 205, 0.3)',
                            opacity: 1
                        }
                    ]}
                    railStyle={{
                        backgroundColor: '#e2e8f0',
                        height: 6
                    }}
                />
            </div>

            {/* Min/Max Labels */}
            <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-xs text-slate-400">{min} جنيه</span>
                <span className="text-xs text-slate-400">{max} جنيه</span>
            </div>
        </div>
    );
};

export default PriceSlider;
