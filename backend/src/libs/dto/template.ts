export interface NewTemplateDto {
    templateId: string
    name: string
    html: {
        title: string
        content: string
    }
}