import { useEffect } from "react";
import { useTranslation } from "ui/i18n";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { declareComponentKeys } from "i18nifty";
import { useCoreFunctions, useCoreState, selectors } from "core";
import type { PageRoute } from "./route";
import { LoadingFallback } from "ui/shared/LoadingFallback";
import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { Markdown } from "keycloakify/tools/Markdown";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { routes, session, getPreviousRouteName } from "ui/routes";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";

type Props = {
    className?: string;
    route: PageRoute;
};

export default function UserProfile(props: Props) {
    const { className, route, ...rest } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { userProfile } = useCoreFunctions();
    const { profile } = useCoreState(selectors.userProfile.profile);

    useEffect(() => {
        userProfile.initialize({ "email": route.params.email });

        return () => {
            userProfile.clear();
        };
    }, [route.params.email]);

    if (profile === undefined) {
        return <LoadingFallback />;
    }

    return <UserProfileReady className={className} />;
}

function UserProfileReady(props: { className?: string }) {
    const { className } = props;

    const { t } = useTranslation({ UserProfile });

    const { profile } = useCoreState(selectors.userProfile.profile);
    const { softwares } = useCoreState(selectors.userProfile.softwares);

    assert(profile !== undefined);
    assert(softwares !== undefined);

    const { cx, classes } = useStyles();

    return (
        <div className={cx(fr.cx("fr-container"), className)}>
            <Breadcrumb
                currentPageLabel={`${profile.email} - ${profile.organization}`}
                homeLinkProps={routes.home().link}
                segments={[
                    {
                        "label": "Users",
                        "linkProps": {}
                    }
                ]}
            />
            <div className={classes.header}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                    href={"#"}
                    onClick={() => {
                        const previousRouteName = getPreviousRouteName();

                        if (previousRouteName === false) {
                            routes.softwareCatalog().push();
                            return;
                        }

                        session.back();
                    }}
                    className={classes.headerBackButton}
                >
                    <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                </a>
                <h4 className={classes.headerTitle}>
                    {t("agent profile", {
                        "email": profile.email,
                        "organization": profile.organization
                    })}
                </h4>
                {profile.isHimself && (
                    <Button
                        className={classes.editProfileButton}
                        iconId="ri-pencil-line"
                        priority="secondary"
                        linkProps={routes.account().link}
                    >
                        {t("edit my profile")}
                    </Button>
                )}
            </div>
            <div className={classes.softwareListing}>
                {softwares.map(
                    ({
                        softwareName,
                        isReferent,
                        isUser,
                        isTechnicalExpert,
                        usecaseDescription
                    }) => (
                        <p>
                            <a
                                {...routes.softwareDetails({
                                    "name": softwareName
                                }).link}
                            >
                                {softwareName}
                            </a>
                            &nbsp;
                            <Tag
                                style={{
                                    "position": "relative",
                                    "top": 4,
                                    "marginLeft": fr.spacing("2v")
                                }}
                                iconId="fr-icon-checkbox-circle-line"
                            >
                                {t("badge text", {
                                    isUser,
                                    isTechnicalExpert,
                                    isReferent
                                })}
                            </Tag>
                            <Markdown className={classes.usecaseDescription}>
                                {usecaseDescription}
                            </Markdown>
                        </p>
                    )
                )}
            </div>
            {profile.about !== undefined ? (
                <Markdown>{profile.about}</Markdown>
            ) : (
                <p>{t("no description")}</p>
            )}
            <div className={classes.sendEmailButtonWrapper}>
                <Button
                    linkProps={{
                        "href": `mailto:${profile.email}`
                    }}
                >
                    {t("send email")}
                </Button>
            </div>
        </div>
    );
}

export const { i18n } = declareComponentKeys<
    | {
          K: "agent profile";
          P: {
              email: string;
              organization: string;
          };
      }
    | "no description"
    | "send email"
    | "edit my profile"
    | {
          K: "badge text";
          P: {
              isUser: boolean;
              isTechnicalExpert: boolean | undefined;
              isReferent: boolean;
          };
      }
>()({ UserProfile });

const useStyles = tss.withName({ UserProfile }).createUseStyles({
    "header": {
        "display": "flex",
        "alignItems": "center",
        "marginBottom": fr.spacing("10v")
    },
    "headerTitle": {
        "marginBottom": 0
    },
    "headerBackButton": {
        "background": "none",
        "marginRight": fr.spacing("4v"),
        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("8v")
            }
        }
    },
    "editProfileButton": {
        "marginLeft": fr.spacing("4v")
    },
    "sendEmailButtonWrapper": {
        ...fr.spacing("margin", { "topBottom": "15v" }),
        "display": "flex",
        "justifyContent": "center"
    },
    "softwareListing": {
        "marginBottom": fr.spacing("10v")
    },
    "usecaseDescription": {
        "marginTop": fr.spacing("4v")
    }
});
