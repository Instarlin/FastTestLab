import React from "react";
import { useMatches } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./Breadcrumb";

export function AutonomousBreadcrumbs({ className }: { className?: string }) {
  const matches = useMatches();

  const crumbs = matches.filter(
    (match) => match.handle && (match.handle as any).breadcrumb
  );

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {crumbs.map((match, index) => {
          const isLast = index === crumbs.length - 1;
          const crumbLabel = (match.handle as any).breadcrumb;
          return (
            <React.Fragment key={match.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumbLabel()}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink to={match.pathname || "#"}>
                    {crumbLabel()}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
