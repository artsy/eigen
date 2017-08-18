export default function dispatchTrackingEvent(data) {
  (window.dataLayer = window.dataLayer || []).push(data);
}
