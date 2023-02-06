import { fr } from "@codegouvfr/react-dsfr";
import { useForm } from "react-hook-form";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

export type FormDataStep1 = {
    softwareType: "desktop" | "cloud" | "library";
};

export function Step1(props: {
    className?: string;
    formData: FormDataStep1 | undefined;
    onFormDataChange: (formData: FormDataStep1) => void;
}) {
    const { className, formData, onFormDataChange } = props;

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<FormDataStep1>({
        "defaultValues": formData
    });

    return (
        <form className={className} onSubmit={handleSubmit(onFormDataChange)}>
            <RadioButtons
                legend=""
                state={errors.softwareType !== undefined ? "error" : undefined}
                stateRelatedMessage="This is field is required"
                options={[
                    {
                        "label": "Logiciel installable sur poste de travail",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "desktop"
                        }
                    },
                    {
                        "label": "Solution logicielle applicative hébergée dans le cloud",
                        "hintText": "Cloud public ou cloud de votre organisation",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "cloud"
                        }
                    },
                    {
                        "label": "Briques ou modules techniques ",
                        "hintText": "Par exemple des proxy, serveurs HTTP ou plugins",
                        "nativeInputProps": {
                            ...register("softwareType", { "required": true }),
                            "value": "library"
                        }
                    }
                ]}
            />
            <Button
                style={{
                    "marginTop": fr.spacing("4v")
                }}
                nativeButtonProps={{
                    "type": "submit"
                }}
            >
                Next
            </Button>
        </form>
    );
}
