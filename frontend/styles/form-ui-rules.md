# UI Rules for Future Forms

1. **Single Source of Truth**: Use a single, reusable form component for both create and edit operations. Pass initial data and mode as props.
2. **Sectioned UI**: Use tab navigation for logical grouping of form sections (e.g., Patient Information, Emergency Contact, Attender Details, Mode of Arrival).
3. **Sidebar Alignment**: All forms must use the `dashboard-form-container` utility class to align flush with the sidebar and adapt to sidebar collapse/expand.
4. **Consistent Actions**: Place form actions (Save/Update, Cancel) at the bottom, right-aligned, with consistent button styles.
5. **Validation & Feedback**: Centralize validation logic in the form component. Show inline errors and toast notifications for feedback.
6. **Accessibility**: Use semantic HTML, proper labels, and keyboard navigation for all form controls.
7. **Responsiveness**: Ensure forms are fully responsive, using grid/flex layouts and adaptive paddings.
8. **No Code Duplication**: Never duplicate form logic or UI between create/edit—always extend the single form component.
9. **Easy Extensibility**: Add new sections/tabs by updating the unified form component only.
10. **Cancel Navigation**: Always provide a cancel button that returns to the previous or list page.
