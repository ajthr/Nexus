import React from 'react';
import { render } from '@testing-library/react';

// Custom render function if we need providers in the future
function customRender(ui, options = {}) {
    return render(ui, { ...options });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
