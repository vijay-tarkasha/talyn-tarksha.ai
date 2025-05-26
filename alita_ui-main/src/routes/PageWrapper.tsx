import { ErrorBoundary, FallbackProps } from "react-error-boundary"

const PageWrapper = (props: any) => {
  return <ErrorBoundary fallbackRender={(props: FallbackProps) => {
    const errorDetails = 'error "' + props.error.message + '" in file ' + encodeURI(props.error.fileName) + ' at line ' + props.error.lineNumber
    return <div>An Error Occured <br /> {errorDetails}</div>
  }
  }>
    {props.children}
  </ErrorBoundary>
};

export default PageWrapper;