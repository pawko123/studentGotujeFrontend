/**
 * Represents a user in the application.
 */
interface User {
    /**
     * The unique identifier of the user.
     */
    id: number;

    /**
     * The username of the user.
     */
    username: string;

    /**
     * The email address of the user.
     */
    email: string;

    /**
     * The role of the user within the application.
     */
    appUserRole: string;

    /**
     * Indicates whether the user account is enabled.
     */
    enabled: boolean;
}

export default User;