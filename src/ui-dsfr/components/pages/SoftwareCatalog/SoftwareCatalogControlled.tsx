import { memo } from "react";
import { makeStyles } from "tss-react/dsfr";
import type { SoftwareCatalogState } from "core-dsfr/usecases/softwareCatalog";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import type { Link } from "type-route";

const sortOptions = [
    "added time",
    "update time",
    "last version publication date",
    "user count",
    "referent count",
    "user count ASC",
    "referent count ASC"
] as const;

assert<Equals<typeof sortOptions[number], SoftwareCatalogState.Sort>>();

export type Props = {
    className?: string;
    softwares: SoftwareCatalogState.Software.External[];
    linksBySoftwareName: Record<
        string,
        Record<"softwareDetails" | "declareUsageForm", Link>
    >;

    search: string;
    onSearchChange: (search: string) => void;

    sort: SoftwareCatalogState.Sort | undefined;
    onSortChange: (sort: SoftwareCatalogState.Sort | undefined) => void;

    organizationOptions: {
        organization: string;
        softwareCount: number;
    }[];
    organization: string | undefined;
    onOrganizationChange: (organization: string | undefined) => void;

    categoryFilerOptions: {
        category: string;
        softwareCount: number;
    }[];
    category: string | undefined;
    onCategoryFilterChange: (category: string | undefined) => void;

    environmentOptions: {
        environment: SoftwareCatalogState.Environment;
        softwareCount: number;
    }[];
    environment: SoftwareCatalogState.Environment | undefined;
    onEnvironmentChange: (
        environmentsFilter: SoftwareCatalogState.Environment | undefined
    ) => void;

    prerogativesOptions: {
        prerogative: SoftwareCatalogState.Prerogative;
        softwareCount: number;
    }[];
    prerogatives: SoftwareCatalogState.Prerogative[];
    onPrerogativesChange: (prerogatives: SoftwareCatalogState.Prerogative[]) => void;
};

export const SoftwareCatalogControlled = memo((props: Props) => {
    const {
        className,
        softwares,
        linksBySoftwareName,
        search,
        onSearchChange,
        sort,
        onSortChange,
        organizationOptions,
        organization,
        onOrganizationChange,
        categoryFilerOptions,
        category,
        onCategoryFilterChange,
        environmentOptions,
        environment,
        onEnvironmentChange,
        prerogativesOptions,
        prerogatives,
        onPrerogativesChange,
        ...rest
    } = props;

    assert<Equals<typeof rest, {}>>();

    const { cx, classes } = useStyles();

    return (
        <div className={cx(classes.root, className)}>
            <pre>
                {JSON.stringify(
                    {
                        softwares,
                        linksBySoftwareName,
                        search,
                        onSearchChange,
                        sort,
                        onSortChange,
                        organizationOptions,
                        organization,
                        onOrganizationChange,
                        categoryFilerOptions,
                        category,
                        onCategoryFilterChange,
                        environmentOptions,
                        environment,
                        onEnvironmentChange,
                        prerogativesOptions,
                        prerogatives,
                        onPrerogativesChange
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
});

const useStyles = makeStyles({ "name": { SoftwareCatalogControlled } })({
    "root": {}
});
