const ApplicationStatusColor = (status: any) => {
    let color = 'var(--default-bgcolor)';
    let bgColor = 'var(--dark-bgcolor)';
    switch (status.toLowerCase()) {
        case 'selected':
            color = 'var(--status-selected-color)';
            bgColor = 'rgba(var(--status-selected-color-rgb),0.1)'
            break;
        case 'on-going':
            color = 'var(--status-ongoing-color)';
            bgColor = 'rgba(var(--status-ongoing-color-rgb),0.1)'
            break;
        case 'ai reject':
            color = 'var(--status-aireject-color)';
            bgColor = 'rgba(var(--status-aireject-color-rgb),0.1)'
            break;
        case 'auto rejected':
            color = 'var(--status-autoreject-color)';
            bgColor = 'rgba(var(--status-autoreject-color-rgb),0.1)'
            break;
        case 'reject':
            color = 'var(--status-cancelled-color)';
            bgColor = 'rgba(var(--status-cancelled-color-rgb),0.1)'
            break;
        case 'ai scheduled':
            color = 'var(--status-aischeduled-color)';
            bgColor = 'rgba(var(--status-aischeduled-color-rgb),0.1)'
            break;
        case 'new':
            color = 'var(--status-new-color)';
            bgColor = 'rgba(var(--status-new-color-rgb),0.1)'
            break;
        case 'offered':
            color = 'var(--status-offered-color)';
            bgColor = 'rgba(var(--status-offered-color-rgb),0.1)'
            break;
        case 'scheduled':
            color = 'var(--status-scheduled-color)';
            bgColor = 'rgba(var(--status-scheduled-color-rgb),0.1)'
            break;
        case 'ai on-going':
            color = 'var(--status-aiongoing-color)';
            bgColor = 'rgba(var(--status-aiongoing-color-rgb),0.1)'
            break;
        default:
            break;
    }
    return { color, bgColor };
}

export { ApplicationStatusColor }