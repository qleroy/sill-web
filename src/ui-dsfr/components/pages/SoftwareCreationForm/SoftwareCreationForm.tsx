import { useEffect, useState, useReducer } from "react";
import { createGroup, type Route } from "type-route";
import { routes } from "ui-dsfr/routes";
import CircularProgress from "@mui/material/CircularProgress";
import { assert } from "tsafe/assert";
import { Step1, type FormDataStep1 } from "./Step1";
import { Step2, type FormDataStep2 } from "./Step2";
import { core } from "./coreMock";
import { makeStyles } from "tss-react/dsfr";

SoftwareCreationForm.routeGroup = createGroup([
    routes.softwareCreationForm,
    routes.softwareUpdateForm
]);

type PageRoute = Route<typeof SoftwareCreationForm.routeGroup>;

SoftwareCreationForm.getDoRequireUserLoggedIn = () => true;

export type Props = {
    className?: string;
    route: PageRoute;
};

export function SoftwareCreationForm(props: Props) {
    const { className, route } = props;

    const [step, dispatchState] = useReducer(
        (state: 1 | 2 | 3, action: "next" | "previous") => {
            switch (state) {
                case 1:
                    assert(action === "next");
                    return 2;
                case 2:
                    switch (action) {
                        case "next":
                            return 3;
                        case "previous":
                            return 1;
                    }
                    break;
                case 3:
                    assert(action === "previous");
                    return 1;
            }
        },
        1
    );

    const [formDataStep1, setFormDataStep1] = useState<FormDataStep1 | undefined>(
        undefined
    );
    const [formDataStep2, setFormDataStep2] = useState<FormDataStep2 | undefined>(
        undefined
    );

    const { isPrefillingForSoftwareUpdate } = (() => {
        const softwareName =
            route.name === "softwareUpdateForm" ? route.params.name : undefined;

        const [isPrefillingForSoftwareUpdate, setIsPrefillingForSoftwareUpdate] =
            useState(softwareName !== undefined ? true : false);

        useEffect(() => {
            if (softwareName === undefined) {
                return;
            }

            let isActive = true;

            (async () => {
                setIsPrefillingForSoftwareUpdate(true);

                const { softwareType, wikidataEntry } = await core.getPrefillData({
                    softwareName
                });

                if (!isActive) {
                    return;
                }

                setFormDataStep1({ softwareType });
                setFormDataStep2({ softwareName, wikidataEntry });

                setIsPrefillingForSoftwareUpdate(false);
            })();

            return () => {
                isActive = false;
            };
        }, []);

        return { isPrefillingForSoftwareUpdate };
    })();

    const { classes } = useStyles({ step });

    if (isPrefillingForSoftwareUpdate) {
        return <CircularProgress />;
    }

    return (
        <div className={className}>
            <h1>
                {(() => {
                    switch (route.name) {
                        case "softwareCreationForm":
                            return "Ajouter un logiciel";
                        case "softwareUpdateForm":
                            return "Mettre a jour un logiciel";
                    }
                })()}
            </h1>
            <Step1
                className={classes.step1}
                formData={formDataStep1}
                onFormDataChange={formData => {
                    console.log("next!!!!!!!!!");
                    setFormDataStep1(formData);
                    dispatchState("next");
                }}
            />
            <Step2
                className={classes.step2}
                isUpdateForm={route.name === "softwareUpdateForm"}
                formData={formDataStep2}
                onFormDataChange={formData => {
                    setFormDataStep2(formData);
                    dispatchState("next");
                }}
                onPrev={() => dispatchState("previous")}
            />
        </div>
    );
}

const useStyles = makeStyles<{ step: 1 | 2 | 3 }>()((_theme, { step }) => ({
    "step1": {
        "display": step === 1 ? "block" : "none"
    },
    "step2": {
        "display": step === 2 ? "block" : "none"
    }
}));
