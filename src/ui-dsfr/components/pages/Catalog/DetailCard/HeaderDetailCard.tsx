import React, { memo } from "react";
import { declareComponentKeys } from "i18nifty";
import { useTranslation } from "ui-dsfr/i18n";
import type { Link } from "type-route";
import { makeStyles } from "tss-react/dsfr";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";

export type Props = {
    className?: string;
    softwareLogoUrl?: string;
    softwareName: string;
    authors: {
        name: string;
        link: Link;
    }[];
    officialWebsite: Link;
    sourceCodeRepository: Link;
};

export const HeaderDetailCard = memo((props: Props) => {
    const {
        className,
        softwareLogoUrl,
        softwareName,
        authors,
        officialWebsite,
        sourceCodeRepository,
        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const { classes, cx } = useStyles();

    const { t } = useTranslation({ HeaderDetailCard });

    return (
        <div className={cx(classes.root, className)}>
            <div className={classes.leftCol}>
                <a href={"/"} className={classes.backButton}>
                    <i className={fr.cx("fr-icon-arrow-left-s-line")} />
                </a>
                <div className={classes.softwareInformation}>
                    <img
                        className={cx(classes.logo)}
                        src={softwareLogoUrl}
                        alt="Logo du logiciel"
                    />
                    <div>
                        <h4 className={classes.softwareName}>{softwareName}</h4>
                        <span>
                            <span className={classes.authors}>{t("authors")}</span>
                            <span>
                                {authors.map(author => (
                                    <a {...author.link} className={classes.authorLink}>
                                        {author.name}
                                    </a>
                                ))}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div className={classes.externalLinkButtons}>
                <Button
                    iconId="fr-icon-global-line"
                    onClick={function noRefCheck() {}}
                    priority="secondary"
                    className={classes.officialWebsiteButton}
                >
                    {t("website")}
                </Button>
                <Button
                    iconId="fr-icon-code-s-slash-line"
                    onClick={function noRefCheck() {}}
                    priority="secondary"
                >
                    {t("repository")}
                </Button>
            </div>
        </div>
    );
});

const useStyles = makeStyles({
    "name": { HeaderDetailCard }
})(theme => ({
    "root": {
        "display": "grid",
        "gridTemplateColumns": `repeat(2, 1fr)`,
        "columnGap": fr.spacing("6v"),
        "marginBottom": fr.spacing("6v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`,
            "gridRowGap": fr.spacing("6v")
        }
    },
    "leftCol": {
        "display": "flex",
        "alignItems": "center"
    },
    "backButton": {
        "background": "none",
        "marginRight": fr.spacing("4v"),

        "&>i": {
            "&::before": {
                "--icon-size": fr.spacing("8v")
            }
        }
    },
    "softwareInformation": {
        "display": "flex",
        "flex": "1"
    },
    "logo": {
        "width": "50px",
        "height": "50px",
        "marginRight": fr.spacing("2v")
    },
    "softwareName": {
        "marginBottom": fr.spacing("1v")
    },
    "authors": {
        "color": theme.decisions.text.mention.grey.default
    },
    "authorLink": {
        "marginRight": fr.spacing("2v"),
        "color": theme.decisions.text.actionHigh.blueFrance.default
    },
    "externalLinkButtons": {
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "end"
    },
    "officialWebsiteButton": {
        "marginRight": fr.spacing("4v")
    }
}));

export const { i18n } = declareComponentKeys<"authors" | "website" | "repository">()({
    HeaderDetailCard
});
